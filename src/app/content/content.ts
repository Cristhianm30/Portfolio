import { Component } from '@angular/core';
import { Profile } from "../profile/profile";
import { Experience } from "../experience/experience";
import { Testimonials } from "../testimonials/testimonials";
import { Articles } from "../articles/articles";
import { Subscribe } from "../subscribe/subscribe";
import { Skills } from "../skills/skills";
import { Education } from "../education/education";
import { Projects } from "../projects/projects";

@Component({
  selector: 'app-content',
  imports: [Profile, Experience, Testimonials, Articles, Subscribe, Skills, Education, Projects],
  templateUrl: './content.html',
  styleUrl: './content.css'
})
export class Content {

}
