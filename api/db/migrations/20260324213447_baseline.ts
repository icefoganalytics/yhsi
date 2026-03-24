import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	// schema already exists
}

export async function down(knex: Knex): Promise<void> {
	// irreversible
}
