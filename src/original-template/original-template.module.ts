import { OriginalTemplateDirective } from './original-template.directive';
import { OriginalTemplateService } from './original-template.service';
import { ModuleWithProviders, NgModule } from '@angular/core';

@NgModule({
  declarations: [OriginalTemplateDirective],
  exports: [OriginalTemplateDirective]
})
export class OriginalTemplateModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OriginalTemplateModule,
      providers: [
        OriginalTemplateService
      ]
    }
  }

}
