BEGIN TRANSACTION;

create table users (
	id serial primary key,
	name varchar(100),
	email text unique not null,
    age int default null,
	entries bigint default 0,
	joined timestamp not null
);

COMMIT;