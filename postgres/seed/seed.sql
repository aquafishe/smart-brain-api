BEGIN TRANSACTION;

INSERT into users (name, email, age, entries, joined) values ('a', 'a@a.com', 25, 2, '2020-8-30');
INSERT into login (hash, email) values ('$2a$04$.ogHQGeH25RYm8xL6cTugeaNRYxZ2e99Z79udQ8IPDaelBLKeQW7m', 'a@a.com');

COMMIT;
