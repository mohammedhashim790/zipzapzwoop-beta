import {Directive, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges} from '@angular/core';
import {animate, AnimationBuilder, AnimationMetadata, AnimationPlayer, style} from "@angular/animations";

@Directive({
  selector: '[TooltipInfo]',
})
export class TooltipInfoDirective implements OnChanges,OnInit{

  private parentElement:any;
  private player: AnimationPlayer | undefined;

  private element!:HTMLSpanElement;

  @Input() state:boolean = false;
  @Input() message:string = "asas";


  tooltipColor:string = "#0000008a";

  constructor(private builder: AnimationBuilder,private ref:ElementRef,private renderer:Renderer2) {
    console.log(ref);
    this.parentElement = ref.nativeElement;
    // this.Init();
  }

  ngOnInit() {
    this.Init();
  }

  Init(){
    this.element = document.createElement("span");
    this.applyStylesToParent();

    // this.element.appendChild(this.bubble());
    this.element.appendChild(this.Message());


    this.renderer.appendChild(this.parentElement,this.element);
  }

  applyStylesToParent(){
    this.element.className = "bubble-message-container";
    // this.element.style.backgroundColor = this.tooltipColor;
    // this.element.style.display = "flex";
    // this.element.style.justifyContent = "center";
    // this.element.style.alignItems = "center";
    // this.element.style.width = "75%";
    // // this.element.style.height = "50px";
    // this.element.style.maxHeight = "50px";
    // this.element.style.position = "absolute";
    // this.element.style.top = "-100%";
    // this.element.style.color = "white";
    // this.element.style.left = "50%";
    // this.element.style.transform = "translateX(-50%)";
    // this.element.style.zIndex = "999999";
    // this.element.style.borderRadius = "10px"
    // this.element.style.padding = "4%";
  }

  Message(): any {
    let element = document.createElement("h6");
    element.innerText = this.message;
    element.style.color = "white";
    return element;
  }

  bubble(){
    let bubble = document.createElement("span");
    bubble.style.display = "flex";
    bubble.style.bottom = "-10px";
    bubble.style.margin = "auto";
    bubble.style.color = "white";
    bubble.style.position = "absolute";
    bubble.style.left = "50%";
    bubble.style.transform = "translateX(-50%)";
    bubble.style.width = "0";
    bubble.style.height = "0";
    bubble.style.borderLeft = "7px solid transparent";
    bubble.style.borderRight = "7px solid transparent";
    bubble.style.borderTop = "10px solid "+this.tooltipColor;

    // bubble.innerHTML = "sample text";
    return bubble;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.element == undefined)
      return;
    if(this.state){
      this.element.style.display = "flex";
    }else{
      this.element.style.display = "none";
    }
    this.show()
  }

  private show(){
    if (this.player) {
      this.player.destroy();
    }

    const metadata = this.state ? this.fadeIn() : this.fadeOut();

    const factory = this.builder.build(metadata);
    this.player = factory.create(this.element);

    this.player.play();
  }

  private fadeIn(): AnimationMetadata[] {
    return [
      style({ opacity: 0 }),
      animate('400ms ease-in', style({ opacity: 1 , display:'flex'})),
    ];
  }

  private fadeOut(): AnimationMetadata[] {
    return [
      style({ opacity: '*' }),
      animate('400ms ease-in', style({ opacity: 0 ,display :'none'})),
    ];
  }


}
