import Vue from 'vue'
import VueRouter from 'vue-router'
import Principal from '../components/Principal.vue'
import ClientesCrud from '../components/ClientesCrud'
import RepresentantesCrud from '../components/RepresentantesCrud'
import ProdutosCrud from '../components/ProdutosCrud'



Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Principal
  },
  {
    path: '/representantes',
    name: 'Representante',
    component: RepresentantesCrud
  },
  {
    path: '/clientes',
    name: 'Cliente',
    component: ClientesCrud
  },
  {
    path: '/produtos',
    name: 'Produto',
    component: ProdutosCrud
  }

 
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
