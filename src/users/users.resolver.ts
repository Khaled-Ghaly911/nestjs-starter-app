import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './user.entity'; 
import { PaginationInput } from 'src/common/pagination/pagination-input'; 
import { PaginatedUsers } from './dtos/paginated-users.dto'; 
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/gaurds/auth.gaurd';
import { RolesGuard } from 'src/auth/gaurds/role.gaurd';
import { Role } from './enum/role.enum';
import { Roles } from 'src/auth/decorators/role.decorator';

@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.USER)
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  async createUser(@Args('createUserDto') createUserDto: CreateUserDto): Promise<User>{
    return this.usersService.create(createUserDto);
  }
  
  // @Mutation(() => [User])
  // async createManyUser(@Args('createUserDto',{ type: () => [CreateUserDto] }) createUserDto: CreateUserDto[]): Promise<User[]>{
  //   return this.usersService.createMany(createUserDto);
  // }

  @Query(() => PaginatedUsers, { name: 'users' })
  async users(@Args('paginationInput') paginationInput: PaginationInput) {
    return this.usersService.findAll(paginationInput);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER)
  @Query(() => User)
  async findUserById(@Args('id') id: string): Promise<User> {
    return this.usersService.findById(id)
  }

  @Query(() => User)
  async findUserByEmail(@Args('email') email: string): Promise<User> {
    const user = await this.findUserByEmail(email);

    if(!user) throw new NotFoundException("user's not found")

    return user;
  }

  @Mutation(() => User)
  async updateUser(@Args('id') id: string, @Args('updateUserDto') updateUserData: UpdateUserDto): Promise<User> {
    return this.usersService.update(id, updateUserData);
  }
 
  @Mutation(() => User) 
  async deleteUser(@Args('id') id: string): Promise<User> {
    return this.usersService.delete(id);
  }
}
