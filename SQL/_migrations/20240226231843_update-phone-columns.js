/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function up(knex) {
    return knex.raw(`
        ALTER TABLE public.employers
            ALTER COLUMN phone_number TYPE character varying(12) COLLATE pg_catalog."default";

        ALTER TABLE public.employers
            ALTER COLUMN fax_number TYPE character varying(12) COLLATE pg_catalog."default";
    `)
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function down(knex) {
    return knex.raw(`
        ALTER TABLE public.employers
            ALTER COLUMN phone_number TYPE character(12) COLLATE pg_catalog."default";

        ALTER TABLE public.employers
            ALTER COLUMN fax_number TYPE character(12) COLLATE pg_catalog."default";
    `)
}
