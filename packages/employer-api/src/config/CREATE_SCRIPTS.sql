CREATE TABLE IF NOT EXISTS public.applications
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    position_title character varying(255) COLLATE pg_catalog."default",
    organization character varying(255) COLLATE pg_catalog."default",
    status character varying(255) COLLATE pg_catalog."default",
    form_type character varying(255) COLLATE pg_catalog."default",
    catchmentno integer,
    workbc_centre character varying(4) COLLATE pg_catalog."default",
    num_positions integer,
    form_confirmation_id character varying(255) COLLATE pg_catalog."default",
    form_submission_id character varying(255) COLLATE pg_catalog."default",
    form_submitted_date timestamptz,
    created_by character varying(255) COLLATE pg_catalog."default",
    created_date timestamptz,
    updated_by character varying(255) COLLATE pg_catalog."default",
    updated_date timestamptz,
    stale boolean,
    CONSTRAINT applications_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.applications
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS public.claims
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    position_title character varying(255) COLLATE pg_catalog."default",
    status character varying(255) COLLATE pg_catalog."default",
    catchmentno integer,
    workbc_centre character varying(4) COLLATE pg_catalog."default",
    employee_first_name character varying(255) COLLATE pg_catalog."default",
    employee_last_name character varying(255) COLLATE pg_catalog."default",
    associated_application_id character varying(10) COLLATE pg_catalog."default",
    form_confirmation_id character varying(255) COLLATE pg_catalog."default",
    form_submission_id character varying(255) COLLATE pg_catalog."default",
    form_submitted_date timestamptz,
    service_provider_form_submission_id character varying(255) COLLATE pg_catalog."default",
    service_provider_form_internal_id character varying(255) COLLATE pg_catalog."default",
    calculator_approved boolean DEFAULT false,
    created_by character varying(255) COLLATE pg_catalog."default",
    created_date timestamptz,
    updated_by character varying(255) COLLATE pg_catalog."default",
    updated_date timestamptz,
    stale boolean,
    CONSTRAINT claims_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.claims
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS public.employers
(
    -- 'id': bceid guid
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    bceid_business_guid character varying(255) COLLATE pg_catalog."default",
    bceid_business_name character varying(255) COLLATE pg_catalog."default",
    contact_name character varying(255) COLLATE pg_catalog."default",
    contact_email character varying(255) COLLATE pg_catalog."default",
    phone_number character(12) COLLATE pg_catalog."default",
    fax_number character(12) COLLATE pg_catalog."default",
    cra_business_number character varying(255) COLLATE pg_catalog."default",
    street_address character varying(255) COLLATE pg_catalog."default",
    city character varying(255) COLLATE pg_catalog."default",
    province character varying(255) COLLATE pg_catalog."default",
    postal_code character varying(255) COLLATE pg_catalog."default",
    workplace_street_address character varying(255) COLLATE pg_catalog."default",
    workplace_city character varying(255) COLLATE pg_catalog."default",
    workplace_province character varying(255) COLLATE pg_catalog."default",
    workplace_postal_code character varying(255) COLLATE pg_catalog."default",
    created_by character varying(255) COLLATE pg_catalog."default",
    created_date timestamptz,
    updated_by character varying(255) COLLATE pg_catalog."default",
    updated_date timestamptz,
    CONSTRAINT employers_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.employers
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS public.employers_applications
(
    employer_id character varying(255) COLLATE pg_catalog."default" REFERENCES employers(id),
    application_id character varying(255) COLLATE pg_catalog."default" REFERENCES applications(id),
    CONSTRAINT employers_applications_pkey PRIMARY KEY (employer_id, application_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.employers_applications
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS public.employers_claims
(
    employer_id character varying(255) COLLATE pg_catalog."default" REFERENCES employers(id),
    claim_id character varying(255) COLLATE pg_catalog."default" REFERENCES claims(id),
    CONSTRAINT employers_claims_pkey PRIMARY KEY (employer_id, claim_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.employers_claims
    OWNER to postgres;


CREATE TABLE IF NOT EXISTS public.notifications
(
    id SERIAL NOT NULL,
    email character varying(255) COLLATE pg_catalog."default",
    username character varying(255) COLLATE pg_catalog."default",
    catchmentno integer,
    type character varying(255) COLLATE pg_catalog."default"
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.notifications
    OWNER to postgres;

