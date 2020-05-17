import { HttpClient } from '@angular/common/http';
import { Post } from './post-model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators'
import { Router } from '@angular/router';

@Injectable({providedIn :'root'}) //INJETA O SERVIÇO NO ROOT DO PROJETO, 2º opção utilizando esta não precisa declarar no providers [] do mudele principal
export class PostService {
  private posts: Post [] = [];
  private postUpdate = new Subject<{posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}

//  getPosts() {
//    this.http.get<{message: string, posts: Post[]}>('http://localhost:3000/api/posts')
//      .subscribe((postData) => {
//        this.posts = postData.posts;
//        this.postUpdate.next(this.posts);
//      });
//  }

  getPosts(postPerPage: number, currentPage: number) {
    const queryParans = `?pagesize=${postPerPage}&page=${currentPage}`;
    this.http.get<{message: string, posts: Post[], maxPosts: number}>('http://localhost:3000/api/posts' + queryParans)
      .pipe(map((postData) => {
        return {
          posts: postData.posts.map(post => {
            return {
              _id: post._id,
              title: post.title,
              content: post.content,
              imagePath: post.imagePath
            }
          }),
          maxPost: postData.maxPosts
        }
      }))
      .subscribe((postTrasnformedData) => {
        this.posts = postTrasnformedData.posts;

        this.postUpdate.next({posts: this.posts, postCount: postTrasnformedData.maxPost});
      });
  }

  getPostUpdateListener() {
    return this.postUpdate.asObservable();
  }

  getOnePostInList(_id: string) {
    return this.posts, this.posts.find(p => p._id === _id);
  }

  updatePost(id: string, title: string, content: string, image: File | string) {

    let postData: Post | FormData;
    if(typeof(image) === 'object') {
      postData =  new FormData();
      postData.append('_id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        _id: id,
        title: title,
        content: content,
        imagePath: image
      };
    }
    this.http.put('http://localhost:3000/api/posts/' + id, postData)
      .subscribe((response) => {
        this.router.navigate(['/']);
      });
  }

  setPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http.post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData)
      .subscribe((postData) => {
        this.router.navigate(['/']);
      });
  }

  deletePostById(id: string) {
   return this.http.delete('http://localhost:3000/api/posts/' + id);
  }

  getPost(id: string) {
    return this.http.get<{message: string, post: Post}>('http://localhost:3000/api/posts/' + id);
  }
}
