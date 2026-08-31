const REQUEST_TIMEOUT_MS = 10_000
const MAX_ATTEMPTS = 3
const BASE_RETRY_DELAY_MS = 500
const MAX_RETRY_DELAY_MS = 30_000

function wait(miliseconds){
    return new Promise((resolve)=>{
        setTimeout(resolve,miliseconds)
    })
}

function isRetryableStatus(status){
    return status=== 429 || status >= 500;
}

function getRetryDelay(response, attempt){
    const retryAfter = response.headers.get('retry-after')

    if (retryAfter){
        const seconds = Number(retryAfter)
        if (Number.isFinite(seconds) && seconds >=0){
            return Math.min(seconds*1_000, MAX_RETRY_DELAY_MS)
        }
    
        const retryDate = Date.parse(retryAfter)
        if (Number.isFinite(retryDate)){
            const delay = Math.max(retryDate - Date.now(), 0)
            return Math.min(delay,MAX_RETRY_DELAY_MS)
        }
    }

    const exponentialDelay = BASE_RETRY_DELAY_MS * 2 ** (attempt-1)
    return Math.min(exponentialDelay, MAX_RETRY_DELAY_MS)
}

export class RobloxApiError extends Error {
  constructor(message, { status, cause } = {}) {
    super(message, { cause });

    this.name = "RobloxApiError";
    this.status = status;
  }
}

export async function requestRobloxJson(url) {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    let response;

    try {
      response = await fetch(url, {
        headers: {
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
    } catch (cause) {
      if (attempt === MAX_ATTEMPTS) {
        throw new RobloxApiError(
          `Roblox request failed after ${MAX_ATTEMPTS} attempts`,
          { cause },
        );
      }

      const delay = BASE_RETRY_DELAY_MS * 2 ** (attempt - 1);
      await wait(delay);
      continue;
    }

    if (response.ok) {
      try {
        return await response.json();
      } catch (cause) {
        throw new RobloxApiError("Roblox returned invalid JSON", {
          status: response.status,
          cause,
        });
      }
    }

    if (!isRetryableStatus(response.status) || attempt === MAX_ATTEMPTS) {
      throw new RobloxApiError(
        `Roblox request failed with HTTP status ${response.status}`,
        { status: response.status },
      );
    }

    await wait(getRetryDelay(response, attempt));
  }

  throw new RobloxApiError("Roblox request failed unexpectedly");
}