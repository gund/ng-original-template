# ng-original-template

> Extract peices of templates from Angular components declaratively or via service

[![Travis CI](https://img.shields.io/travis/gund/ng-original-template/master.svg?maxAge=2592000)](https://travis-ci.org/gund/ng-original-template)
[![Coverage](https://img.shields.io/codecov/c/github/gund/ng-original-template.svg?maxAge=2592000)](https://codecov.io/gh/gund/ng-original-template)
[![Npm](https://img.shields.io/npm/v/ng-original-template.svg?maxAge=2592000)](https://badge.fury.io/js/ng-original-template)
[![Npm Downloads](https://img.shields.io/npm/dt/ng-original-template.svg?maxAge=2592000)](https://www.npmjs.com/package/ng-original-template)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Greenkeeper badge](https://badges.greenkeeper.io/gund/ng-original-template.svg)](https://greenkeeper.io/)

## Installation

```bash
$ npm install --save ng-original-template
```

## Usage

Import `OriginalTemplateModule` module in your root module:
```ts
import { OriginalTemplateModule } from 'ng-original-template';

@NgModule({
  imports: [OriginalTemplateModule.forRoot()]
})
export class AppModule { }
```

You can also import this module into your sub-modules if you need to use directive.
Just remember to import with `forRoot()` method only for your root module.

### Declarative usage

Now in component where you want to get it's template:
1. Provide component type via `provideTemplateFrom()` function
2. In template mark which section of template you want to get and in what property to save it via `originalTemplate` directive
```ts
import { provideTemplateFrom } from 'ng-original-template';

@Component({
  selector: 'my-component',
  providers: [provideTemplateFrom(MyComponent)] // <-- #1 Provide type
  template: `<div>`
    + `<h1 originalTemplate="h1">Hello</h1>`    // <-- #2 Mark template piece
    + `<code>{{ h1 }}</code>`                   // <-- You can now simply render this piece of template
  + `</div>`
})
class MyComponent {
  h1: string; // <-- Optionally create property where template will be stored to be AOT compatible
}
```

### Programmatic usage

You can also get pieces of template in your code via `OriginalTemplateService`:
1. Just mark the piece of template you want with any attribute
2. Pass component type and attribute regex string to match
```ts
import { OriginalTemplateService } from 'ng-original-template';

@Component({
  selector: 'my-component',
  template: `<div>`
    + `<h1 h1Marker>Hello</h1>` // <-- #1 Mark template piece
  + `</div>`
})
class MyComponent {
  constructor(originalTemplate: OriginalTemplateService) {
    const h1 = originalTemplate.getTemplatePeice(MyComponent, 'h1Marker'); // <-- #2 Get a template string
    // h1 now is a string containing `<h1 h1Marker>Hello</h1>`
  }
}
```

## Documentation

**OriginalTemplateDirective**
```ts
class OriginalTemplateDirective {
  @Input() originalTemplate: string;
  @Input() originalTemplateInner: boolean;
  @Input() originalTemplatePrecise: boolean;
}
```

<sub>See [src/original-template/original-template.directive.ts](./src/original-template/original-template.directive.ts) for full reference</sub>

_Description_: Directive to get piece of template declaratively. All calls forwarded to `OriginalTemplateService` internally.
Input **originalTemplate** is _required_ to tell where to store template in component instance.
Input **originalTemplateInner** is _optional_ to get only inner template (skip the node where this directive was placed).
Input **originalTemplatePrecise** is _optional_ to enable precise mode for getting outer template (slower).

**OriginalTemplateService**
```ts
class OriginalTemplateService {
  static maxPreciseIterations: number;
  getTemplatePeice(component: Type<any>, matchRegexp: string, options?: {
      inner?: boolean;
      precise?: boolean;
  }): string;
```

<sub>See [src/original-template/original-template.service.ts](./src/original-template/original-template.service.ts) for full reference</sub>

_Description_: Get a piece of template from component by directive match regexp.
By default it will get outer template in not precise mode.
If you selecting custom element - it will be the fastest method.
For common html tags like `div` it might be inacurate - so you may want to enable precise mode.
If you selecting inner template - precise mode will be used anyway.

NOTE: `matchRegexp` argument is used to construct a regexp and is not escaped so you can build flexible matches.

## Development

To generate all `*.js`, `*.js.map`, `*.d.ts` and `*.metadata.json` files:

```bash
$ npm run build
```

To lint all `*.ts` files:

```bash
$ npm run lint
```

To run unit tests:

```bash
$ npm test
```

## License

MIT © [Alex Malkevich](malkevich.alex@gmail.com)
