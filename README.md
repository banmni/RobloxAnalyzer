# Robloyze

Robloyze is a Roblox analytics website designed to identify new and growing Roblox experiences.

Roblox provides current statistics such as concurrent users, visits, favorites, and votes, but it does not provide the public historical CCU data Robloyze needs. 
Robloyze will collect snapshots every 15 minutes and store them in mysql.

Requirements: 
```
- Git
- Node.Js
- Mysql community
```
Make sure they are actually there :
```
- node --version
- npm.cmd --version
- mysql --version
```
Project Packages :
 - npm.cmd ci

make template:
 - Copy-Item .env.example .env

MYSQL:
Connecting into it : 
```
- mysql -u root -p
```
 creating the database :
   ```
   CREATE DATABASE IF NOT EXISTS robloyze
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_0900_ai_ci;
  
  CREATE USER IF NOT EXISTS 'robloyze_app'@'localhost'
    IDENTIFIED BY 'YOUR_PASSWORD';
  
  GRANT SELECT, INSERT, UPDATE
  ON robloyze.*
  TO 'robloyze_app'@'localhost';
  ```
`utf8mb4` allows the database to store international characters and emoji that may appear in Roblox names and descriptions.
