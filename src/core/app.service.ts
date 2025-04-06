import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { SeedService } from 'src/seed/seed.service';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(private readonly seedService: SeedService) {}
  getHello(): string {
    return 'Hello World!';
  }

  async onApplicationBootstrap() {
    await this.seedService.seedSuperAdmin();
  }
}
