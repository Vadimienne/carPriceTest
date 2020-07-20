import React from 'react'
import Icon from '../icons.js'
import MenuIcons from '../menuIndexes.js'
import Swiper from 'react-id-swiper';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import arrayMove from 'array-move';

// icon images for sortable-hoc
const SortableItem = SortableElement(({value}) => <img className='app-icon' src={value} />);

const SortableMenuItem = SortableElement(({value}) => <img className='menu-app-icon' src={value} />);


class Index extends React.PureComponent {

    constructor(props){
        super(props)

        this.state = {
            isSorting: false,
            slides: 0,
            activeSlide: 0
        }

        this.toggleSorting = this.toggleSorting.bind(this)
        this.onSortingEnd = this.onSortingEnd.bind(this)
        this.onMenuSortingEnd = this.onMenuSortingEnd.bind(this)
        this.generateSlides = this.generateSlides.bind(this)
        this.renderSlides = this.renderSlides.bind(this)
        this.renderMenuIcons = this.renderMenuIcons.bind(this)
    }

    // this one is for swiper
    params = {
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true
        },
        
        on:{
            'slideChange': (params)=>{this.setState({activeSlide: params.activeIndex})}
        },
        noSwiping: false
    }

    // toggle drag sorting of icons
    toggleSorting(){
        this.setState({isSorting: !this.state.isSorting})
    }

    // sort array after icon drag
    onSortingEnd = ({oldIndex, newIndex}, arrayIndex) => {
        let array = this.state.slides[arrayIndex]

        let sortedArray = arrayMove(array, oldIndex, newIndex)

        let slides = this.state.slides

        slides[arrayIndex] = sortedArray
        this.setState({slides: slides});
        window.localStorage.setItem('slides', JSON.stringify(slides))

        this.forceUpdate()
    };

    // sort menu icons array after menu icon drag 
    onMenuSortingEnd({oldIndex, newIndex}){
        let array = this.state.menuIcons
        array = arrayMove(array, oldIndex, newIndex)
        this.setState({menuIcons: array})
        window.localStorage.setItem('menuIcons', JSON.stringify(array))
        this.forceUpdate()
        
    }

    // stacks icons in arrays of 20 elements each
    generateSlides(icons) {
        let slidesArray = []
        for (let i = 0; i < icons.length; i++){
            if (i%20 == 0) {
                slidesArray.push([])
            }
            slidesArray[slidesArray.length-1].push(icons[i])
        }

        return slidesArray
    
    }

    // make a markup of all slides
    renderSlides(slidesArray, isSorting){  
        // sortable-hoc is disabled when device isn't in sort-mode
        if (isSorting){
            const SortableList = SortableContainer(({items}) => {
                return (
                <div className='app-page'>
                    {items.map((value, index) => (
                    <SortableItem key={`item-${value}`} index={index} value={value.src} />
                    ))}
                </div>
                );
            });

            let {activeSlide} = this.state 

            return  <SortableList 
                        className='app-page' 
                        onSortEnd={(oldNewIndexes) => {this.onSortingEnd(oldNewIndexes, activeSlide)}} 
                        items={slidesArray[activeSlide]} 
                        axis='xy'>
                    </SortableList>
        }
        else{
            return slidesArray.map(el => 
                <div className='app-page'>
                    {el.map(app => <img key='' className='app-icon' src={app.src}></img>)}
                </div>)
        }
    }

    // same as renderSlides but for menu icons
    renderMenuIcons(icons, isSorting){
        if (isSorting){
            const SortableMenuList = SortableContainer(({items}) => {
                return (
                <div className='menu-sort-container'>
                    {items.map((value, index) => (
                    <SortableMenuItem key={`item-menu-icon-${value}`} index={index} value={value.src} />
                    ))}
                </div>
                );
            });

            return  <SortableMenuList 
                        //className='app-page' 
                        onSortEnd={this.onMenuSortingEnd}
                        items={icons} 
                        axis='x'>
                    </SortableMenuList>

        }
        else{
            return icons.map(el => <img className='menu-app-icon' src={el.src}></img>)
        }
    }

    // fill state with menu and slide icons
    // get it from localStorage if possible
    // otherwise get it from icons.js and menuIndexes.js
    componentDidMount(){
        if( window && window.localStorage && window.localStorage.getItem('slides')){
            this.setState({slides: JSON.parse(window.localStorage.getItem('slides')) })
        }
        else{
            this.setState({slides: this.generateSlides(Icon)})
        }

        if( window && window.localStorage && window.localStorage.getItem('menuIcons')){
            this.setState({menuIcons: JSON.parse(window.localStorage.getItem('menuIcons')) })
        }
        else{
            this.setState({menuIcons: Icon.filter((el, index) => MenuIcons.includes(index))})
        }

    }
    

    render(){


        const { isSorting } = this.state

        if(!this.state.slides || !this.state.menuIcons){
            return 0
        }
        let slides = this.renderSlides(this.state.slides, isSorting)

        let menu = this.renderMenuIcons(this.state.menuIcons, isSorting)


        return(
        <>
            <div className='device'></div>
            <div className='background'></div>
            <div className='bottom-menu'>{menu}</div>
            
            {isSorting?
            <div className='swiper-container'>{slides}</div>
            :
            <Swiper {...this.params} 
                //ref={this.swiperRef}
                initialSlide={this.state.activeSlide}
            >
                {slides}
            </Swiper>
            }

            <button className='sorting-toggle-btn' type='button' onClick={this.toggleSorting}>{this.state.isSorting ? 'Готово': 'Сортировать'}</button>
        </>
        )
    }
}

export function getServerSideProps() {
    return {props: {}}
}

export default Index