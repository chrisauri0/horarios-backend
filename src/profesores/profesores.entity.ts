
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'profesores' })
export class Profesores {
	@PrimaryColumn('uuid')
	profesor_id: string;

	@Column()
	nombre: string;

	@Column()
	apellidos: string;

	@Column()
	email: string;

	@Column({ type: 'boolean', nullable: true, default: false })
	can_be_tutor?: boolean;

	@Column({ type: 'json', nullable: true, default: () => "'[]'" })
	materias?: object;

	@Column({ type: 'json', nullable: true, default: () => "'{}'" })
	metadata?: object;

	@Column({ name: 'created_at', type: 'timestamptz', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
	created_at?: Date;

	@Column({ name: 'updated_at', type: 'timestamptz', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
	updated_at?: Date;

	// Relaciones con grupos y turores_grupos pueden agregarse si se usan entidades relacionadas
}
