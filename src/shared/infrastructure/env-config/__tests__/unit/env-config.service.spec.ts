import { Test, TestingModule } from '@nestjs/testing';
import { EnvConfigService } from '../../env-config.service';
import { EnvConfigModule } from '../../env-config.module';

describe('EnvConfigService unit tests', () => {
  let stu: EnvConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EnvConfigModule.forRoot()],
      providers: [EnvConfigService],
    }).compile();

    stu = module.get<EnvConfigService>(EnvConfigService);
  });

  it('should be defined', () => {
    expect(stu).toBeDefined();
  });

  it('should return the variable PORT', () => {
    expect(stu.getAppPort()).toBe(3000);
  });

    it('should return the variable NODE_ENV', () => {
    expect(stu.getNodeEnv()).toBe('test');
  });
});
