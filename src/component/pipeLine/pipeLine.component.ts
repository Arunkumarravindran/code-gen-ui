import { Component, OnInit } from '@angular/core';
import { flyIn } from 'src/assets/animations';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ErrorService } from 'src/_service/error.service';

@Component({
  selector: 'app-pipeLine',
  templateUrl: './pipeLine.component.html',
  styleUrls: ['./pipeLine.component.css'],
  animations:[ flyIn]
})
export class PipeLineComponent implements OnInit {
java = true;
other =false;
selectedAddonList :string[] = [];
JenkinsForm: FormGroup;
kubernetesForm: FormGroup;
currentScreen:string = 'jenkins';
  constructor(private errorService:ErrorService) { }

  ngOnInit() {
    this.selectedAddonList = JSON.parse(sessionStorage.getItem('selectedAddon'))
    this.JenkinsForm = new FormGroup({
      apiName: new FormControl('',[Validators.required]),
      ocirPassword: new FormControl(''),
      ocirUsername: new FormControl(''),
      ocirRepository: new FormControl(''),
      ocirRegistry: new FormControl(''),
      buildTag: new FormControl(''),
});
    this.kubernetesForm = new FormGroup({
      name: new FormControl(''),
      namespace: new FormControl(''),
      noOfReplicas: new FormControl(''),
      imageUrl: new FormControl(''),
      port: new FormControl(''),
      targetPort: new FormControl(''),
    });
}


  getPipe($event){
    this.currentScreen = $event.target.value;
    console.log(this.currentScreen)
  }
  
  storePipleline(): boolean {
    if (this.currentScreen == 'jenkins') {
      if (!(this.JenkinsForm.value.apiName && this.JenkinsForm.value.ocirPassword &&
        this.JenkinsForm.value.ocirRepository && this.JenkinsForm.value.ocirRegistry && this.JenkinsForm.value.buildTag)) {
        this.errorService.open("Please provide all the input for Jenkins contributor in Pipeline");
        return false;
      }
      let pipelineFormGroupValue = {
        apiName: this.JenkinsForm.value.apiName,
        ocirPassword: this.JenkinsForm.value.ocirPassword,
        ocirRepository: this.JenkinsForm.value.ocirRepository,
        ocirRegistry: this.JenkinsForm.value.ocirRegistry,
        buildTag: this.JenkinsForm.value.buildTag
      }
      let pipelineFormGroupValueJson = JSON.stringify(pipelineFormGroupValue)
      sessionStorage.removeItem('pipelineKubernetesFormGroupValue');
      sessionStorage.setItem('pipelineJenkinsFormGroupValue', pipelineFormGroupValueJson);
    } else if (this.currentScreen == 'kubernetes') {
      if (!(this.kubernetesForm.value.name && this.kubernetesForm.value.namespace &&
        this.kubernetesForm.value.noOfReplicas && this.kubernetesForm.value.imageUrl && this.kubernetesForm.value.port && this.kubernetesForm.value.targetPort)) {
        this.errorService.open("Please provide all the input for kubernetes contributor in Pipeline");
        return false;
      }
      let pipelineFormGroupValue = {
        name: this.kubernetesForm.value.name,
        namespace: this.kubernetesForm.value.namespace,
        noOfReplicas: this.kubernetesForm.value.noOfReplicas,
        imageUrl: this.kubernetesForm.value.imageUrl,
        port: this.kubernetesForm.value.port,
        targetPort: this.kubernetesForm.value.targetPort
      }
      let pipelineFormGroupValueJson = JSON.stringify(pipelineFormGroupValue)
      sessionStorage.removeItem('pipelineJenkinsFormGroupValue');
      sessionStorage.setItem('pipelineKubernetesFormGroupValue', pipelineFormGroupValueJson);
    }
    return true;
  }
}
