import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, StyleSheet } from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { DISHES } from '../shared/dishes';
import { COMMENTS } from '../shared/comments';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';

import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
}

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment, currentDate) => dispatch(postComment(dishId, rating, author, comment, currentDate))
})

function RenderDish(props) {
    const dish = props.dish;
    if (dish != null) {
        return(
            <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>

                <Card
                    featuredTitle={dish.name}
                    //image={require('./images/uthappizza.png')}>
                    image={{uri: baseUrl + dish.image}}>
                    <Text style={{margin: 10}}>
                        {dish.description}
                    </Text>

                    <View style={styles.cardRow}> 
                        <Icon
                            raised
                            reverse
                            name={ props.favorite ? 'heart' : 'heart-o'}
                            type='font-awesome'
                            color='#f50'
                            onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                            />
                        <Icon style={styles.cardItem}
                            raised
                            reverse
                            name='fa-pencil-alt'
                            type='font-awesome'
                            color='#512da7'
                            onPress={() => props.onShowModal}
                            />
                    </View>
                </Card>
            </Animatable.View>
        );
    }
    else {
        return(<View></View>);
    }
}

function RenderComments(props) {
    const comments = props.comments;
    const renderCommentItem = ({item, index}) => {
        return (
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Text style={{fontSize: 12}}>{item.rating} Stars</Text><Rating />
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };
    
    return (
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>        
            <Card title='Comments' >
                <FlatList 
                    data={comments}
                    renderItem={renderCommentItem}
                    keyExtractor={item => item.id.toString()}
                    />
            </Card>
        </Animatable.View>
    );
}

class DishDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dishes: DISHES,
            comments: COMMENTS,
            favorites: [],

            showModal: false,

            rating: 5,
            author: "",
            comment: ""
        };
    }

    toggleModal() {
        this.setState({showModal: !this.state.showModal});
    }

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    resetForm() {
        this.setState({
            dishes: DISHES,
            comments: COMMENTS,
            favorites: [],

            showModal: false,

            rating: 5,
            author: "",
            comment: ""
        });
    }

    handleComment() {
        //console.log(JSON.stringify(this.state));
        this.postComment(this.state.dishes.id, this.state.rating, this.state.author, this.state.comment);
        this.toggleModal();
    }


    static navigationOptions = {
        //title: 'Dish Details'
        title: 'Menu'
    };

    render() {
        const dishId = this.props.navigation.getParam('dishId','');
        return (
            // <ScrollView>
            //     <RenderDish dish={this.state.dishes[+dishId]}
            //         favorite={this.state.favorites.some(el => el === dishId)}
            //         onPress={() => this.markFavorite(dishId)} 
            //         />
            //     <RenderComments comments={this.state.comments.filter((comment) => comment.dishId === dishId)} />
            // </ScrollView>
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)}
                    onShowModal={() => this.toggleModal} 
                    />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
                
                <Modal animationType = {"slide"} transparent = {false}
                    visible = {this.state.showModal}
                    onDismiss = {() => this.toggleModal() }
                    onRequestClose = {() => this.toggleModal() }>
                    <View style = {styles.modal}>
                        <Text style = {styles.modalTitle}>Title here</Text>

                        <Text style = {styles.modalText}>Rating </Text>
                        <Rating 
                            type='star'
                            ratingCount={this.state.rating}
                            startingValue={this.state.rating}
                            showRating
                            onFinishRating={(rating)=>this.setState({rating: rating})}
                            />

                        <Text style = {styles.modalText}>Author </Text>
                        <Input 
                              placeholder={this.state.author}
                              onChangeText={(author) => this.setState({author: author})}
                            />

                        <Text style = {styles.modalText}>Comment </Text>
                        <Input 
                            placeholder={this.state.comment}
                            onChangeText={(comment) => this.setState({comment: comment})}
                            />
                        
                        <Button 
                            onPress = {() =>{this.handleComment(); this.resetForm();}}
                            color="#512DA7"
                            title="Submit" 
                            />
                        <Button 
                            onPress = {() =>{this.toggleModal(); this.resetForm();}}
                            color="#808080"
                            title="Cancel" 
                            />
                    </View>
                </Modal>

            </ScrollView>
        );
    }
}


const styles = StyleSheet.create({
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#512DA8',
        textAlign: 'center',
        color: 'white',
        marginBottom: 20
    },

    // Keep?
    modalText: {
        fontSize: 18,
        margin: 10
    },

    modal: {
        justifyContent: 'center',
        margin: 20
    },
    cardRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    cardItem: {
        flex: 1,
        margin: 10
    }
});

// export default DishDetail;
export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);
