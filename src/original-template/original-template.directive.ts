import { OriginalTemplateService } from './original-template.service';
import {
  Directive,
  ExistingProvider,
  forwardRef,
  Inject,
  Input,
  OnInit,
  OpaqueToken,
  Optional,
  Type
} from '@angular/core';

export const ORIGINAL_TEMPLATE_PROVIDER = new OpaqueToken('ORIGINAL_TEMPLATE_PROVIDER');

export function provideTemplateFrom(component: Type<any>): ExistingProvider {
  return {
    provide: ORIGINAL_TEMPLATE_PROVIDER,
    useExisting: forwardRef(() => component)
  };
}

@Directive({
  selector: '[originalTemplate]'
})
export class OriginalTemplateDirective implements OnInit {

  @Input() originalTemplate: string;
  @Input() originalTemplateInner: boolean;
  @Input() originalTemplatePrecise: boolean;

  private component: Type<any>;

  constructor(
    @Optional() private service: OriginalTemplateService,
    @Inject(ORIGINAL_TEMPLATE_PROVIDER) @Optional() private componentInst: any
  ) {
    if (!service) {
      throw Error(`OriginalTemplateDirective: OriginalTemplateService is not available.
      Please import in root module OriginalTemplateModule.forRoot()`);
    }

    if (!componentInst) {
      throw Error(
        'OriginalTemplateDirective: You should provide component via `provideTemplateFrom()` function in your component`s providers!');
    }

    this.component = componentInst.constructor;
  }

  ngOnInit() {
    const matchRegex = `originalTemplate=["|']?${this.originalTemplate}["|']?`;

    if (this.componentInst[this.originalTemplate] !== undefined) {
      console.warn(`OriginalTemplateDirective: Overriding property '${this.originalTemplate}' in component '${this.component.name}'`);
    }

    try {
      this.componentInst[this.originalTemplate] = this.service.getTemplatePeice(this.component, matchRegex, {
        inner: this.originalTemplateInner,
        precise: this.originalTemplatePrecise
      });
    } catch (e) {
      this.componentInst[this.originalTemplate] = '';
      console.warn(`OriginalTemplateDirective: ${e}`);
    }
  }

}
