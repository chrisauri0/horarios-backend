
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'salones' })
export class Salones {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	nombre_salon: string;

	@Column()
	nombre_edificio: string;

	@Column({ type: 'json' })
	data: object;

	@Column({ name: 'created_at', type: 'timestamptz', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
	created_at?: Date;

	@Column({ name: 'updated_at', type: 'timestamptz', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
	updated_at?: Date;
}
