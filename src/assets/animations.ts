import { trigger, query, transition, style, animate, state, group } from '@angular/animations';

export const flyIn = [
    trigger("EnterLeave", [
        state("flyIn", style({ transform: "translateX(0)" })),
        transition(":enter", [ 
          style({ transform: "translateX(-100%)" }),
          animate("0.2s 100ms ease-in")
        ]),
        transition(":leave", [
          animate("0.2s ease-out", style({ transform: "translateX(100%)" }))
        ])
      ]),
    trigger('displayState', [
      state('inactive', style({
        transform: 'scaleY(0)'
      })),
      state('active',   style({
        transform: 'scaleY(1)'
      })),
      transition('inactive => active', animate('500ms ease-in')),
      transition('active => inactive', animate('500ms ease-out'))
    ])
]