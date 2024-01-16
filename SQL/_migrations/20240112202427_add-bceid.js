/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function up(knex) {
    return knex.raw(`
    ALTER TABLE IF EXISTS public.applications
        ADD COLUMN created_by_idp character varying(255);
    ALTER TABLE IF EXISTS public.claims
        ADD COLUMN created_by_idp character varying(255);
    ALTER TABLE IF EXISTS public.employers
        ADD COLUMN bceid_username character varying(255);
    `)
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function down(knex) {
    return knex.raw(`
    ALTER TABLE IF EXISTS public.applications DROP COLUMN IF EXISTS created_by_idp;
    ALTER TABLE IF EXISTS public.claims DROP COLUMN IF EXISTS created_by_idp;
    ALTER TABLE IF EXISTS public.employers DROP COLUMN IF EXISTS bceid_username;
    `)
}
