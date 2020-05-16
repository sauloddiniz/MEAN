import { PostService } from './../post-service';
import { Component, OnInit} from "@angular/core";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';


@Component({
  selector : 'app-post-create',
  templateUrl : './post-create-component.html',
  styleUrls : ['./post-create-component.css']
})

export class PostCreateComponent implements OnInit{

  enteredTitle = '';
  enteredContent = '';
  // @Output() postCreated = new EventEmitter<Post>();
  mode = 'create';
  imagePreview: string;

  form: FormGroup;


  constructor(public postService: PostService, public router: ActivatedRoute){}
  ngOnInit(): void {

    this.form = new FormGroup({
      '_id': new FormControl(null),
      'title' : new FormControl(null,
        {validators: [Validators.required, Validators.minLength(3)]}),
      'content' : new FormControl(null,
        {validators: [Validators.required]}),
        'image': new FormControl(null, {
          validators: [Validators.required],
          asyncValidators: [mimeType]})
    });

    this.router.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('post._id')) {
        this.postService.getPost(paramMap.get('post._id'))
          .subscribe((postData) => {
            const post = postData.post;
            this.form.setValue({
              '_id': post._id,
              'title': post.title,
              'content': post.content,
              'image': post.imagePath
            });
            this.imagePreview = post.imagePath;
          });
          this.mode = 'edit';
      } else {
        this.mode = 'create'
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({'image': file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = (reader.result) as string;
    }
    reader.readAsDataURL(file);
  }

  onSubmit() {
    if(this.form.invalid) {
      return;
    } else
    if (this.mode === 'edit') {
      this.postService.updatePost(
        this.form.get('_id').value,
        this.form.get('title').value,
        this.form.get('content').value,
        this.form.get('image').value
        );
    }

    if (this.mode === 'create') {
      this.postService.setPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
        );
    }
    this.form.reset();
    // else {
    //   const post: Post = {
    //     title : postForm.value.title,
    //     content : postForm.value.content
    //   }
    //   this.postCreated.emit(post);
    //   postForm.resetForm();
    // }
  }
}
