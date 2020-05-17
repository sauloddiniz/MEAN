import { PostService } from './../post-service';
import { Post } from './../post-model';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

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
  totalPagination = 0; //numero total de paginação
  postPorPage = 1; //numero de resultado por pagina
  pageSizeOptions = [2, 4, 8] //opção de alteração do numero de resultado por pagina
  currentPage = 1;
  constructor(public postService: PostService){}

  ngOnInit(): void {
    this.isSpinner = true;
    this.postService.getPosts(this.postPorPage, this.currentPage);
    this.postsSub = this.postService.getPostUpdateListener()
    .subscribe((postData: {posts: Post[], postCount: number}) => {
      this.posts = postData.posts;
      this.totalPagination = postData.postCount;
      this.isSpinner = false;
    });
  }

  pageEventPaginator(pageEvent: PageEvent) {
    console.log(pageEvent);
    this.postPorPage = +pageEvent.pageSize;
    this.currentPage = +pageEvent.pageIndex + 1;
    this.postService.getPosts(this.postPorPage, this.currentPage);
  }

  onDelete(id: string) {
    this.postService.deletePostById(id).subscribe(() => {
      this.postService.getPosts(this.postPorPage, this.currentPage);
    });
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }
}

