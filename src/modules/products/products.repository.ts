import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ProductsRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  // Add repository methods here
}
