import { container } from 'tsyringe';

import IStorageProvider from './models/ICacheProvider';

import RedisCacheProvider from './implementations/RedisCacheProvider';

const providers =  {
  redis: RedisCacheProvider,
}

container.registerSingleton<IStorageProvider>(
  'CacheProvider',
  providers.redis,
);
