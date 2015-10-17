#!/bin/sh
tablename="userscores"
username="postgres"
tablespace_dirname="/tablespace"

dir_script_run_from=$(pwd)
TABLESPACE_PATH=$dir_script_run_from$tablespace_dirname

# SQL BEGINS
psql DBNAME USERNAME << EOF
    CREATE TABLESPACE userscores_tablespace LOCATION $TABLESPACE_PATH;

		DROP TABLE IF EXISTS "myTable";

    CREATE TABLE $tablename (
			  id SERIAL PRIMARY KEY,
        username character varying,
        password character varying,
        score INTEGER,
        red_presses INTEGER,
        orange_presses INTEGER,
        yellow_presses INTEGER,
        green_presses INTEGER,
        blue_presses INTEGER,
        purple_presses INTEGER,
        black_presses INTEGER
    );


		INSERT INTO $tablename (
			username,password,
			score,
			red_presses,orange_presses,yellow_presses,
			green_presses,blue_presses,purple_presses,
			black_presses
		) VALUES (
			'someName',
			'somePassword',
			4534,
			13,6656,1,
			54,
			1,2,
			2111
		);

		INSERT INTO $tablename (
			username,password,
			score,
			red_presses,orange_presses,yellow_presses,
			green_presses,blue_presses,purple_presses,
			black_presses
		) VALUES (
			'someName',
			'somePassword',
			6899,
			3,5,41,
			13,
			16,656,
			1141
		);

		INSERT INTO $tablename (
			username,password,
			score,
			red_presses,orange_presses,yellow_presses,
			green_presses,blue_presses,purple_presses,
			black_presses
		) VALUES (
			'someName',
			'somePassword',
			656,
			4,6655,5431,
			54,
			31,25,
			7777
		);

		INSERT INTO $tablename (
			username,password,
			score,
			red_presses,orange_presses,yellow_presses,
			green_presses,blue_presses,purple_presses,
			black_presses
		) VALUES (
			'someName',
			'somePassword',
			543,
			6,664,3232,
			24,
			1534,12,
			6474
		);

		INSERT INTO $tablename (
			username,password,
			score,
			red_presses,orange_presses,yellow_presses,
			green_presses,blue_presses,purple_presses,
			black_presses
		) VALUES (
			'someName',
			'somePassword',
			444,
			1,6656,3232,
			54,
			15,262,
			453
		);

		INSERT INTO $tablename (
			username,password,
			score,
			red_presses,orange_presses,yellow_presses,
			green_presses,blue_presses,purple_presses,
			black_presses
		) VALUES (
			'someName',
			'somePassword',
			43,
			3,6656,3232,
			54,
			1,285,
			5
		);

		INSERT INTO $tablename (
			username,password,
			score,
			red_presses,orange_presses,yellow_presses,
			green_presses,blue_presses,purple_presses,
			black_presses
		) VALUES (
			'someName',
			'somePassword',
			12,
			5,6656,1523,
			5344,
			61,2,
			1111
		);


EOF
# END SQL