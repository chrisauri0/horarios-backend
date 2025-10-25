
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'grupos' })
export class Grupos {
	@PrimaryColumn('uuid')
	grupo_id: string;

	@Column()
	name: string;

	@Column({ type: 'uuid', nullable: true })
	tutor_id?: string;

	@Column({ type: 'json', nullable: true, default: () => "'{}'" })
	metadata?: object;

	@Column({ name: 'created_at', type: 'timestamptz', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
	created_at?: Date;

	// Relaciones con profesores y turores_grupos pueden agregarse si se usan entidades relacionadas
}
