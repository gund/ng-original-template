import { Injectable, Type } from '@angular/core';
import { Annotations } from '@gund/ng-annotations';

@Injectable()
export class OriginalTemplateService {

  /**
   * Maximum tags that can be traversed during precise parsing of template.
   * You can increase this if your template is big.
   */
  static maxPreciseIterations = 100;

  private static _templateCache = new Map<Type<any>, string>();

  /**
   * Get a piece of template from component by directive match regexp.
   * By default it will get outer template in not precise mode.
   * If you selecting custom element - it will be the fastest method.
   * For common html tags like `div` it might be inacurate - so you ma want enable precise mode.
   * If you selecting inner template - precise mode will be used anyway.
   *
   * @param component Component Type
   * @param matchRegexp Matching directive
   * @param options Optional options
   */
  getTemplatePeice(component: Type<any>, matchRegexp: string, { inner = false, precise = false } = {}): string {
    const template = this._getTemplate(component);

    const tpl = this._getOuterTemplate(template, matchRegexp);

    if (!tpl) {
      throw Error(`OriginalTemplateService: Failed to extract template for regexp '${matchRegexp}'`);
    }

    if (inner) {
      return this._getInnerTemplate(this._getPreciseTemplate(tpl));
    } else if (precise) {
      return this._getPreciseTemplate(tpl);
    }

    return tpl;
  }

  private _getTemplate(component: Type<any>): string {
    if (OriginalTemplateService._templateCache.has(component)) {
      return OriginalTemplateService._templateCache.get(component);
    }

    let template = '';

    try {
      template = Annotations.getForComponent(component).template;
    } catch (_) { }

    OriginalTemplateService._templateCache.set(component, template);

    return template;
  }

  private _getPreciseTemplate(tpl: string): string {
    const openCloseRegex = /<(\/?[^\s>]+)[^>]*>/g;
    const rootTag = tpl.match(/^<([^\s]+)/);

    if (!rootTag) {
      return tpl; // Inner template does not start with tag - no need to cut deeper
    }

    const rootTagName = rootTag[1];
    let rootTagOpened = 0, i = 0, lastIndex = 0, lastTag = '';

    do {
      const tagMatch = openCloseRegex.exec(tpl);

      if (!tagMatch) {
        break;
      }

      const tag = tagMatch[1];
      lastIndex = tagMatch.index;
      lastTag = tag;

      if (tag === rootTagName) {
        rootTagOpened++;
      } else if (tag === `/${rootTagName}`) {
        rootTagOpened--;
      }
    } while (rootTagOpened && ++i < OriginalTemplateService.maxPreciseIterations);

    return tpl.substr(0, lastIndex) + `<${lastTag}>`;
  }

  private _getOuterTemplate(tpl: string, matchDirective: string): string {
    const regexp = new RegExp(`(<([^\\s]+).*${matchDirective}.*>[^]*<\/\\2>)`);
    const matches = tpl.match(regexp);

    if (!matches || matches.length < 2) {
      return '';
    }

    return matches[1].trim();
  }

  private _getInnerTemplate(tpl: string): string {
    const regexp = /^<([^\s]+)[^>]*>([^]*)<\/\1>$/;
    const matches = regexp.exec(tpl);

    if (!matches || matches.length < 3) {
      return '';
    }

    return matches[2];
  }

}
