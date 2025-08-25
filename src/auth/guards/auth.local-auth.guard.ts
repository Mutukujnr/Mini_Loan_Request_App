import { AuthGuard } from '@nestjs/passport';

export class LOcalAuthGuard extends AuthGuard('local') {}
