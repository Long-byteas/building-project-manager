import { Injectable } from '@angular/core';
import { Project } from './data_model/project';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private http: HttpClient, private messageService: MessageService) {}

  private projectsApi = 'api/projects';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  getProject(id: string): Observable<Project> {
    const url = `${this.projectsApi}/${id}`;
    return this.http.get<Project>(url).pipe(
      tap((_) => this.log(`fetched project id=${id}`)),
      catchError(this.handleError<Project>(`httpGetProject id=${id}`))
    );
  }

  getProjects(): Observable<Project[]> {
    return this.http
      .get<Project[]>(this.projectsApi)
      .pipe(catchError(this.handleError<Project[]>('httpGetProjects', [])));
  }

  updateProject(project: Project): Observable<any> {
    return this.http.put(this.projectsApi, project, this.httpOptions).pipe(
      tap((_) => this.log(`updated project id=${project.id}`)),
      catchError(this.handleError<any>('updateProject'))
    );
  }

  addProject(project: Project): Observable<Project> {
    return this.http
      .post<Project>(this.projectsApi, project, this.httpOptions)
      .pipe(
        tap((newProject: Project) =>
          this.log(`added project w/ id=${newProject.id}`)
        ),
        catchError(this.handleError<Project>('addProject'))
      );
  }

  deleteProject(id: string): Observable<Project> {
    const url = `${this.projectsApi}/${id}`;

    return this.http.delete<Project>(url, this.httpOptions).pipe(
      tap((_) => this.log(`deleted project id=${id}`)),
      catchError(this.handleError<Project>('deleteProject'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(error);

      this.messageService.showErrorMessage(`${operation} failed: ${error.message}`);

      // Go on with empty result
      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.showMessage(message);
  }
}
