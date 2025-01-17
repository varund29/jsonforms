/*
  The MIT License

  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import { Injectable } from '@angular/core';
import { OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  JsonFormsAngularService,
  JsonFormsBaseRenderer
} from '@jsonforms/angular/src/index';
import {
  JsonFormsState,
  Layout,
  mapStateToLayoutProps,
  OwnPropsOfRenderer,
  UISchemaElement
} from '@jsonforms/core/src/index';
import { Subscription } from 'rxjs';

Injectable()
export class LayoutRenderer<T extends Layout> extends JsonFormsBaseRenderer<T>
  implements OnInit, OnDestroy {
  hidden: boolean;
  private subscription: Subscription;

  constructor(private jsonFormsService: JsonFormsAngularService, protected changeDetectionRef: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    this.subscription = this.jsonFormsService.$state.subscribe({
      next: (state: JsonFormsState) => {
        const props = mapStateToLayoutProps(state, this.getOwnProps());
        this.hidden = !props.visible;
        this.changeDetectionRef.markForCheck();
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  get renderProps(): OwnPropsOfRenderer[] {
    const elements = (this.uischema.elements || []).map(
      (el: UISchemaElement) => ({
        uischema: el,
        schema: this.schema,
        path: this.path
      })
    );
    return elements;
  }

  trackElement(_index: number, renderProp: OwnPropsOfRenderer): string {
    return renderProp
      ? renderProp.path + JSON.stringify(renderProp.uischema)
      : null;
  }
}
