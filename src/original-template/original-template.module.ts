import { OriginalTemplateDirective } from './original-template.directive';
import { OriginalTemplateService } from './original-template.service';
import { ModuleWithProviders, NgModule } from '@angular/core';

export interface ModuleConfig {
  maxPresiceIterations?: number;
}

@NgModule({
  declarations: [OriginalTemplateDirective],
  exports: [OriginalTemplateDirective]
})
export class OriginalTemplateModule {

  static forRoot(config?: ModuleConfig): ModuleWithProviders {
    if (config) {
      OriginalTemplateModule._applyConfig(config);
    }

    return {
      ngModule: OriginalTemplateModule,
      providers: [
        OriginalTemplateService
      ]
    }
  }

  private static _applyConfig(config: ModuleConfig) {
    if (Number.isInteger(config.maxPresiceIterations)) {
      OriginalTemplateService.maxPreciseIterations = config.maxPresiceIterations;
    }
  }

}
