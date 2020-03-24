import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from "../../environments/environment"
import { Post } from './post.model';

const BACKEND_URL = environment.apiUrl + '/posts/';

@Injectable({ providedIn: 'root' })
export class PostsService {
	private posts: Post[] = [];
	private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

	constructor(private http: HttpClient, private router: Router) {}

	getPosts(postsPerPage: number, currentPage: number) {
		//return [...this.posts];
		const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
		this.http
			.get<{ message: string, posts: any, maxPosts: number }>(BACKEND_URL + queryParams)
			.pipe(
				map((postData) => {				
					return {
						posts: postData.posts.map(obj => {
							return {
								title: obj.title,
								content: obj.content,
								id: obj._id,
								imagePath: obj.imagePath,
								creator: obj.creator
							};
						}),
						maxPosts: postData.maxPosts
					};
				})
			)
			.subscribe((transformedPostData) => {
				this.posts = transformedPostData.posts;
				this.postsUpdated.next({
					posts: [...this.posts], 
					postCount: transformedPostData.maxPosts
				});
			});
	}

	getPostUpdateListener() {
		return this.postsUpdated.asObservable();
	}

	getPost(id:string) {
		return this.http.get<{ _id:string, title:string, content:string, imagePath: string, creator: string}>(
			BACKEND_URL + id
		);
	}

	addPost(title: string, content: string, image: File) {
		//const post: Post = { id: null,  title: title, content: content };
		const postData = new FormData();
		postData.append("title", title);
		postData.append("content", content);
		postData.append("image", image,title);

		this.http.post<{ message: string, post:Post }>(
				BACKEND_URL,  
				postData
			)
			.subscribe((responseData) => {
				//console.log(responseData.message);
				/*const id = responseData.postId;
				post.id = id;
			
				const post: Post = {
					id: responseData.post.id,
					title: title,
					content: content,
					imagePath: responseData.post.imagePath
				};
				this.posts.push(post);
				this.postsUpdated.next([...this.posts]);
				*/
				this.router.navigate(["/"]);
			});		
	}

	updatedPost(id:string, title:string, content:string, image: File | string) {
		let postData: Post | FormData;
		if(typeof(image) === 'object'){
			postData = new FormData();
			postData.append("id", id);
			postData.append("title", title);
			postData.append("content", content);
			postData.append("image", image, title);			
		} else {
			postData = {
				id: id, 
				title: title, 
				content: content, 
				imagePath: image,
				creator: null 
			};
		}
		this.http
		.put<{ message: string }>(
				BACKEND_URL + id, 
				postData
			)
		 	.subscribe((responseData) => {
		 		/*
		 		const updatedPosts = [...this.posts];
		 		const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
		 		const post: Post = {
		 			id: id, 
					title: title, 
					content: content, 
					imagePath: ''		
		 		}
		 		updatedPosts[oldPostIndex] = post;
		 		this.posts = updatedPosts;
		 		this.postsUpdated.next([...this.posts]);
		 		*/
		 		this.router.navigate(["/"]);
			}
		);
	}

	deletePost(postId: String) {		
		return this.http.delete<{ message: string }>(BACKEND_URL + postId);
			/*
			.subscribe((responseData) => {
				//console.log(responseData.message);
				const updatedPost = this.posts.filter(post => post.id !== postId);
				this.posts = updatedPost;
				this.postsUpdated.next([...this.posts]);
			});
			*/
	}
}