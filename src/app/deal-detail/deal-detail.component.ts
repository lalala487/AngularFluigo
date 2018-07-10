import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-deal-detail',
  templateUrl: './deal-detail.component.html',
  styleUrls: ['./deal-detail.component.css']
})
export class DealDetailComponent implements OnInit {
  slug: string;
  @Input() deal: Deal;

  constructor(
    private route: ActivatedRoute,
    private db: FirestoreService
  ) { }

  ngOnInit() {
    this.route.paramMap
      .switchMap((params: ParamMap) => {
        this.slug = params.get('slug');

        return this.db.col$('deal', ref => ref.where('slug', '==', this.slug));
      }).subscribe(deals => {
        this.deal = deals ? deals[0] as Deal : undefined;
      });
  }
}
