import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ais } from '../../modelsAI/aismodel';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Output() aiSelected = new EventEmitter<any>();
  @Input() selectedAiId: string | undefined;
availableAis=[...ais]
  

  selectAi(ai: any) {
    this.aiSelected.emit(ai);
  }
}