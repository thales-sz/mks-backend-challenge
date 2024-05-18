import { Customer } from '../src/database/models/customer.entity';

export function makeMockCustomer(): Customer {
  return new Customer({
    id: '46278856-590c-4307-9bc0-2f4e2dc76065',
    username: 'Fake Customer Name',
    email: 'fake@email.com',
    password: 'fakepassword',
    updatedAt: new Date(),
    createdAt: new Date(),
    deletedAt: null,
  });
}
