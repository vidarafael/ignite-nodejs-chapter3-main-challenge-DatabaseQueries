import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User | undefined> {
    // Complete usando ORM
    const user = await this.repository.findOne({
      relations: ['games'],
      where: { id: user_id }
    })

    return user;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    // Complete usando raw query
    return this.repository
      .query(`
        SELECT "users"."first_name" 
        FROM "users" 
        JOIN "users_games_games" AS "ug" 
          ON "ug"."usersId" = "users"."id" 
        GROUP BY "users"."first_name" 
        ORDER BY "users"."first_name" ASC
      `)
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    // Complete usando raw query
    return this.repository
      .query(`
        SELECT "user"."email", "user"."first_name", "user"."last_name"
        FROM "users" AS "user"
        WHERE "user"."first_name" ILIKE '${first_name}'
        AND "user"."last_name" ILIKE '${last_name}'
      `)
  }
}
