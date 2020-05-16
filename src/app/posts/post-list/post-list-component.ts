import { PostService } from './../post-service';
import { Post } from './../post-model';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector : 'app-post-list-component',
  templateUrl : './post-list-component.html',
  styleUrls : ['./post-list-component.css']
})

export class PostListComponent implements OnInit, OnDestroy {

  //@Input() posts: Post[] = [];
  posts: Post[] = [];
  private postsSub: Subscription;
  isSpinner = false;

  constructor(public postService: PostService){}

  ngOnInit(): void {
    this.isSpinner = true;
    this.postService.getPosts();
    this.postsSub = this.postService.getPostUpdateListener()
    .subscribe((posts: any[]) => {
      this.posts = posts;
      this.isSpinner = false;
    });
  }

  onDelete(id: string) {
    this.postService.deletePostById(id);
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }
}

