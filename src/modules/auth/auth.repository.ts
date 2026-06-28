import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  // Add repository methods here
}
