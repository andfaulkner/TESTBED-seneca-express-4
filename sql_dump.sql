--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner:
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: userscores; Type: TABLE; Schema: public; Owner: andfaulkner; Tablespace:
--

CREATE TABLE userscores (
    id integer NOT NULL,
    username character varying,
    password character varying,
    score integer,
    red_presses integer,
    orange_presses integer,
    yellow_presses integer,
    green_presses integer,
    blue_presses integer,
    purple_presses integer,
    black_presses integer
);


ALTER TABLE userscores OWNER TO andfaulkner;

--
-- Name: userscores_id_seq; Type: SEQUENCE; Schema: public; Owner: andfaulkner
--

CREATE SEQUENCE userscores_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE userscores_id_seq OWNER TO andfaulkner;

--
-- Name: userscores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: andfaulkner
--

ALTER SEQUENCE userscores_id_seq OWNED BY userscores.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: andfaulkner
--

ALTER TABLE ONLY userscores ALTER COLUMN id SET DEFAULT nextval('userscores_id_seq'::regclass);


--
-- Data for Name: userscores; Type: TABLE DATA; Schema: public; Owner: andfaulkner
--

COPY userscores (id, username, password, score, red_presses, orange_presses, yellow_presses, green_presses, blue_presses, purple_presses, black_presses) FROM stdin;
1	someName	somePassword	4534	13	6656	1	54	1	2	2111
2	someName	somePassword	4534	13	6656	1	54	1	2	2111
3	someName	somePassword	6899	3	5	41	13	16	656	1141
4	someName	somePassword	656	4	6655	5431	54	31	25	7777
5	someName	somePassword	543	6	664	3232	24	1534	12	6474
6	someName	somePassword	444	1	6656	3232	54	15	262	453
7	someName	somePassword	43	3	6656	3232	54	1	285	5
8	someName	somePassword	12	5	6656	1523	5344	61	2	1111
\.


--
-- Name: userscores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: andfaulkner
--

SELECT pg_catalog.setval('userscores_id_seq', 8, true);


--
-- Name: userscores_pkey; Type: CONSTRAINT; Schema: public; Owner: andfaulkner; Tablespace:
--

ALTER TABLE ONLY userscores
    ADD CONSTRAINT userscores_pkey PRIMARY KEY (id);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

