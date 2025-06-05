import {makeAutoObservable} from "mobx"

export default class ProductStore {
    constructor(){
        this._collection = []
        this._designer = []
        this._product = []
        this._selectedCollection = {}
        this._selectedDesigner = {}
        this._page = 1
        this._totalCount = 0
        this._limit = 2
        makeAutoObservable(this)
    }

    setCollection(collection){
        this._collection = collection
    }
    setDesigner(designer){
        this._designer = designer
    }
    setProduct(product){
        this._product = product
    }
    setPage(page) {
        this._page = page
    }
    setTotalCount(count) {
        this._totalCount = count
    }
    setSelectedCollection(collection){
        this.setPage(1)
        this._selectedCollection = collection
    }

    setSelectedDesigner(designer){
        this.setPage(1)
        this._selectedDesigner = designer
    }

    get collection(){
        return this._collection
    }
    get designer(){
        return this._designer
    }
    get product(){
        return this._product
    }
    get selectedCollection(){
        return this._selectedCollection
    }
    get selectedDesigner(){
        return this._selectedDesigner
    }
    get totalCount(){
        return this._totalCount
    }
    get page(){
        return this._page
    }
    get limit(){
        return this._limit
    }
}