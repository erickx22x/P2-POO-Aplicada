<template>
    <v-data-table :headers="headers" :items="produtos" sort-by="id">

        <template v-slot:top>
            <v-toolbar flat>
                <v-toolbar-title>My CRUD</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                
                <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on"> Novo Produto </v-btn>
                    </template>

                    <v-card>
                        <v-card-title> <span class="headline">{{ formTitle }}</span> </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.id" label="ID*" required type="number"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.nome" label="Nome*"  required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.preco" label="Preço*" type="number" step=".01" required></v-text-field>
                                    </v-col>         
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.empresa" label="Empresa*" required></v-text-field>
                                    </v-col>          
                                </v-row>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="close"> Fechar </v-btn>
                            <v-btn color="blue darken-1" text @click="save"> Salvar </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                

                <v-dialog v-model="dialogDelete" max-width="500px">
                    <v-card>
                        <v-card-title class="headline">Deseja apagar esse produto?</v-card-title>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="closeDelete">Não</v-btn>
                            <v-btn color="blue darken-1" text @click="deleteItemConfirm">Sim</v-btn>
                            <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-dialog>

            </v-toolbar>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
            <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
        </template>
        <template v-slot:no-data>
            <v-btn color="primary" @click="inicializa"> Reset </v-btn>
        </template>
    </v-data-table>
</template>

<script>
import axios from "axios";

export default {
    name: "Produtos",
    data () {
        return {
            dialog: false,
            dialogDelete: false,
            headers: [
                {text:"ID", value:"id"},
                {text: "Nome", value:"nome"},
                {text:"Preço", value:"preco"},
                {text:"Empresa", value:"empresa",sortable: false},
                {text: "Ações", value: "actions", sortable: false}
            ],
            produtos: [],
            editedIndex: -1,
            editedItem: {
                id: 0,
                nome: "",
                preco: 0.00,
                empresa: ""
            },
            defaultItem: {
                id: 0,
                nome: "",
                preco: 0.00,
                empresa: ""
            },
        } 
    },
    methods: {
        inicializa() {
            axios("http://localhost:3000/produtos")
            .then((response) => {
                this.produtos = response.data;
            })
            .catch((error) => console.log(error))
        },
        close() {
            this.dialog = false;
            setTimeout(() => {
                this.editedItem = Object.assign({}, this.defaultItem);
                this.editedIndex = -1;
            }, 300);
        },
        save() {
            if (this.editedIndex > -1) { //alteração
                axios.put("http://localhost:3000/produtos/" + this.editedItem.id, this.editedItem)
                .then(response => {
                    console.log(response);
                    Object.assign(this.produtos[this.editedIndex], this.editedItem);
                    this.close();
                })
                .catch(error => console.log(error));
            } else {
                axios.post("http://localhost:3000/produtos", this.editedItem)
                .then(response => {
                    console.log(response);
                    this.produtos.push(this.editedItem);
                    this.close();
                })
                .catch(error => console.log(error));
            }
        },
        editItem(item) {
            this.editedIndex = this.produtos.indexOf(item);
            console.log(this.editedIndex);
            this.editedItem = Object.assign({}, item);
            this.dialog = true;
        },
        deleteItem(item) {
            this.editedIndex = item.id
            this.editedItem = Object.assign({}, item)
            console.log(this.editedIndex);
            this.dialogDelete = true
        },
        deleteItemConfirm () {
            axios.delete("http://localhost:3000/produtos/" + this.editedIndex)
            .then(response => {
                console.log(response.data);
                this.produtos.splice(this.editedIndex, 1);
            })
            .catch(error => console.log(error));
            this.closeDelete();
        },
        closeDelete () {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },
    },
    computed: {
        formTitle() {
            return this.editedIndex === -1 ? "Novo Item" : "Editar Item"
        }
    },
    created() {
        this.inicializa();
    }
}
</script>