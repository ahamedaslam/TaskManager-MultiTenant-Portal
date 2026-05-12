import { Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { RequestHelper } from '../../helpers/RequestHelper';
import { DASHBOARDURL, GETALLTASKSURL, CHATBOTURL} from '../../Utility/ServiceConstant';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

hoveredTasks: any[] = [];
hoveredStatus = '';

//ai-chatbot
message: any[] = []; // any can hold any type of data, here it is used to store chat messages
userMessage: string = ''; // to hold the current message input by the user
isChatOpen = false; // by default the chat window is closed


  dashboard = {
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0
  };

  tasks: any[] = [];

  constructor(
    private requestHelper: RequestHelper,
    private toastr: ToastrService
  ) {}

  taskChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [0,0]
      }
    ]
  };

  // Bar chart
taskBarChart: ChartConfiguration<'bar'>['data'] = {
  labels: ['Completed', 'Pending', 'Overdue', 'High Priority'],
  datasets: [
    {
      label: 'Tasks',
      data: [0, 0, 0, 0]
    }
  ]
};

  ngOnInit(): void {
    this.loadDashboardStats();
    this.loadTasks();
  }


  /* ---------------- Tooltip Options ---------------- */

 chartOptions: ChartConfiguration<'doughnut'>['options'] = {
  plugins: {
    tooltip: {
      callbacks: {
        label: (context: any) => {

          const status = context.label;

          const filteredTasks = this.tasks.filter(t =>
            status === 'Completed'
              ? t.isCompleted
              : !t.isCompleted
          );

          if (filteredTasks.length === 0) {
            return `${status}: No tasks`;
          }

          // Return array -> Chart.js displays each item as new line
          return filteredTasks.map((t: any) => `• ${t.title}`);
        }
      }
    }
  }
};

  /* -------- Dashboard Numbers -------- */

  loadDashboardStats(){

    this.requestHelper.sendData('GET', DASHBOARDURL, null).subscribe({

      next:(res:any)=>{

        if(res.responseCode === 0){

          this.dashboard = res.responseDatas;

          this.taskChartData = {
            labels:['Completed','Pending'],
            datasets:[
              {
                data:[
                  this.dashboard.completedTasks,
                  this.dashboard.pendingTasks
                ]
              }
            ]
          };

        }

      },
      error:(err)=>{
        console.error(err);
      }

    });

  }

  /* -------- Tasks for Tooltip -------- */

 loadTasks(){

  const url = `${GETALLTASKSURL}?pageNumber=1&pageSize=10`;

  this.requestHelper.sendData('POST', url, null).subscribe({

    next:(res:any)=>{

      if(res.responseCode === 0){

        this.tasks = res.responseDatas;

        const completed = this.tasks.filter(t => t.isCompleted).length;

        const pending = this.tasks.filter(t => !t.isCompleted).length;

        const today = new Date();

        const overdue = this.tasks.filter(t =>
          !t.isCompleted && new Date(t.dueTime) < today
        ).length;

        const highPriority = this.tasks.filter(t => t.priority === 1).length;

        this.taskBarChart = {
          labels: ['Completed','Pending','Overdue','High Priority'],
          datasets:[
            {
              label:'Tasks',
              data:[completed,pending,overdue,highPriority]
            }
          ]
        };

      }

    },
    error:(err)=>{
      console.error(err);
    }

  });

  

}

  /* -------- Chat-Bot -------- */


toggleChat() {

  //using of 'this' keyword to access the component's property 'isChatOpen' and toggle its value between true and false.
  this.isChatOpen = !this.isChatOpen; // Toggle the chat window open/close state
}

// This method will be called when the user submits a message in the chat input field. It will add the user's message to the chat history and then call the sendMessage() method to handle sending the message to the backend or processing it further.
sendMessage(){

  if(!this.userMessage)return; 


  // Add the user's message to the chat history with a sender identifier of 'user'. This allows the chat interface to differentiate between messages sent by the user and responses from the chatbot or system.
  this.message.push
  ({
      text: this.userMessage,
      sender: 'user'
   });

   const payLoad = {
    message: this.userMessage
  };

  this.requestHelper.sendData('POST', CHATBOTURL, payLoad).subscribe({
    next: (res: any) => {

      if (res.responseCode === 0) {

        let aiData = res.responseDatas;

        // Handle JSON or string
        if (typeof aiData === 'object') {
          aiData = JSON.stringify(aiData, null, 2);
        }

        this.message.push({
          text: aiData,
          sender: 'bot'
        });

      } else {
        this.toastr.error('AI response failed');
      }

    },

    error: (err) => {
      console.error(err);
      this.toastr.error('Error calling AI');
    }

  });

  this.userMessage = '';
}


}