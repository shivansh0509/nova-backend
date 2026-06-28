const fs = require('fs');
const path = require('path');

const modules = ['auth', 'users', 'products', 'orders', 'cart', 'wishlist', 'admin'];
const baseDir = path.join(__dirname, 'src', 'modules');

for (const mod of modules) {
  const modDir = path.join(baseDir, mod);
  const dtoDir = path.join(modDir, 'dto');
  
  if (!fs.existsSync(dtoDir)) {
    fs.mkdirSync(dtoDir, { recursive: true });
  }

  // Generate Repository
  const capMod = mod.charAt(0).toUpperCase() + mod.slice(1);
  const repoContent = `import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ${capMod}Repository {
  constructor(private readonly databaseService: DatabaseService) {}
  
  // Add repository methods here
}
`;
  fs.writeFileSync(path.join(modDir, `${mod}.repository.ts`), repoContent);

  // Generate basic Create DTO
  let singular = mod.endsWith('s') ? mod.slice(0, -1) : mod;
  if (mod === 'auth') singular = 'auth';
  const capSingular = singular.charAt(0).toUpperCase() + singular.slice(1);

  const dtoContent = `import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class Create${capSingular}Dto {
  @ApiProperty({ description: 'Example property', required: false })
  @IsOptional()
  @IsString()
  exampleProperty?: string;
}
`;
  fs.writeFileSync(path.join(dtoDir, `create-${singular}.dto.ts`), dtoContent);

  // Generate basic Update DTO
  const updateDtoContent = `import { PartialType } from '@nestjs/swagger';
import { Create${capSingular}Dto } from './create-${singular}.dto';

export class Update${capSingular}Dto extends PartialType(Create${capSingular}Dto) {}
`;
  fs.writeFileSync(path.join(dtoDir, `update-${singular}.dto.ts`), updateDtoContent);

  // Update Service to use Repository
  const servicePath = path.join(modDir, `${mod}.service.ts`);
  if (fs.existsSync(servicePath)) {
    const serviceContent = `import { Injectable } from '@nestjs/common';
import { ${capMod}Repository } from './${mod}.repository';
import { Create${capSingular}Dto } from './dto/create-${singular}.dto';
import { Update${capSingular}Dto } from './dto/update-${singular}.dto';

@Injectable()
export class ${capMod}Service {
  constructor(private readonly repository: ${capMod}Repository) {}

  create(createDto: Create${capSingular}Dto) {
    return 'This action adds a new ${singular}';
  }

  findAll() {
    return \`This action returns all ${mod}\`;
  }

  findOne(id: string) {
    return \`This action returns a #\${id} ${singular}\`;
  }

  update(id: string, updateDto: Update${capSingular}Dto) {
    return \`This action updates a #\${id} ${singular}\`;
  }

  remove(id: string) {
    return \`This action removes a #\${id} ${singular}\`;
  }
}
`;
    fs.writeFileSync(servicePath, serviceContent);
  }

  // Update Controller to have Swagger decorators
  const controllerPath = path.join(modDir, `${mod}.controller.ts`);
  if (fs.existsSync(controllerPath)) {
    const controllerContent = `import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ${capMod}Service } from './${mod}.service';
import { Create${capSingular}Dto } from './dto/create-${singular}.dto';
import { Update${capSingular}Dto } from './dto/update-${singular}.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('${capMod}')
@ApiBearerAuth()
@Controller('${mod}')
export class ${capMod}Controller {
  constructor(private readonly service: ${capMod}Service) {}

  @Post()
  @ApiOperation({ summary: 'Create a new ${singular}' })
  @ApiResponse({ status: 201, description: 'The ${singular} has been successfully created.' })
  create(@Body() createDto: Create${capSingular}Dto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all ${mod}' })
  @ApiResponse({ status: 200, description: 'Return all ${mod}.' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a ${singular}' })
  @ApiResponse({ status: 200, description: 'Return the ${singular}.' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a ${singular}' })
  @ApiResponse({ status: 200, description: 'The ${singular} has been successfully updated.' })
  update(@Param('id') id: string, @Body() updateDto: Update${capSingular}Dto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a ${singular}' })
  @ApiResponse({ status: 200, description: 'The ${singular} has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
`;
    fs.writeFileSync(controllerPath, controllerContent);
  }

  // Update Module to provide Repository and import DatabaseModule
  const modulePath = path.join(modDir, `${mod}.module.ts`);
  if (fs.existsSync(modulePath)) {
    const moduleContent = `import { Module } from '@nestjs/common';
import { ${capMod}Service } from './${mod}.service';
import { ${capMod}Controller } from './${mod}.controller';
import { ${capMod}Repository } from './${mod}.repository';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [${capMod}Controller],
  providers: [${capMod}Service, ${capMod}Repository],
  exports: [${capMod}Service],
})
export class ${capMod}Module {}
`;
    fs.writeFileSync(modulePath, moduleContent);
  }
}

console.log('Scaffolding complete!');
