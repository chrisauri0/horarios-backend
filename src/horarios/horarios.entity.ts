
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'horarios' })
export class Horarios {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	nombregrupo: string;

	@Column({ type: 'json' })
	data: object;

	@Column({ name: 'created_at', type: 'timestamptz', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
	created_at?: Date;

	@Column({ name: 'updated_at', type: 'timestamptz', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
	updated_at?: Date;
}
