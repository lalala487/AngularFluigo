import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

export const firestoreServiceStub: any = {
    colWithIds$: jasmine.createSpy('colWithIds$').and.returnValue(Observable.of([])),
    col$: jasmine.createSpy('col$').and.returnValue(Observable.of([
        {
            'slug': 'slug',
            'name': {
                'en_GB': 'some random name'
            }
        }
    ]))
};
