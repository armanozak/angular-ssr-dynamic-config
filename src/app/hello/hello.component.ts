import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { CONFIG, Config } from '../config';

@Component({
  selector: 'app-hello',
  templateUrl: './hello.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelloComponent {
  receiver: string;

  constructor(
    @Inject(TRANSLOCO_SCOPE) public readonly translocoScope: string,
    @Inject(CONFIG) config: Config
  ) {
    this.receiver = config.company.name;
  }
}
