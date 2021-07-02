import React, { Component } from 'react';

class Carousel extends Component {
    state = { 
        total: 3,
        selected: 0,
        images: ['https://placekitten.com/200/150','https://placekitten.com/200/150','https://placekitten.com/200/150'],
        imageUrl: 'https://placekitten.com/200/150'
     }

    // constructor () {
    //     super()
    //     this.handleRight = this.handleRight.bind(this);
    //     this.handleLeft = this.handleLeft.bind(this);
    // }

    handleRight = () => {
        if(this.state.selected < this.state.total - 1)
            this.setState({ selected: this.state.selected + 1})
        else 
            this.setState({selected: 0})
        }

    handleLeft = () => {
        if(this.state.selected === 0)
            this.setState({ selected: this.state.total - 1})
        else 
            this.setState({selected: this.state.selected - 1})
        }


    render() { 
        return (
        <React.Fragment>
            <img src='https://placekitten.com/200/150' alt="kitten" />
            <img src={this.state.imageUrl} alt="kitten" />
            <span>{this.formatCarousel()}</span>
            <button>Left</button>
            <button>Right</button>
        </React.Fragment>
        );
    }

    formatCarousel() {
        const { selected } = this.state
        return selected 
    }

}
 
export default Carousel;