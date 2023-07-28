import { html } from 'lit';

export const CustomDndStyles = html`
    <custom-style>
    <style>
            .item-row{
                display: flex;
                cursor:default;
                align-items: center;
                color: var(--fw-crud-dnd-item-color);
                background-color: var(--fw-crud-dnd-item-background,white);
                width: 100%;
            }
            .item-bottom-border{
                border-bottom: var(--fw-crud-dnd-item-border-size,2px) solid var(--fw-crud-dnd-item-border-color,transparent);
                border-radius: var(--fw-crud-dnd-border-radius,10px);
            }
            .item-grid-container{
                width: 100%;
                display: inline-grid;
                gap: 10px;
                word-break: break-word;
                align-items: center;
                grid-template-columns: 1fr 2fr auto auto;
                font-size: var(--fw-crud-dnd-item-font-size,17px);
                padding: 5px 0px;
                padding-left: 10px;
                min-height: 40px;
                user-select: none;
            }
            .item-grid-container > paper-input:invalid{
                margin-bottom:10px;
            }
            .item-grid-container > .grid-template-1-column{
                grid-template-columns:1fr ;
            }
            .item-grid-container > .grid-template-3-column{
                grid-template-columns:1fr auto auto;
            }
            .item-grid-container span{
                user-select:text;
            }
            #add-new-item-btn{
                color: var(--fw-crud-dnd-add-button-color,'');
                background: var(--fw-crud-dnd-add-button-background,'');
                cursor: pointer;
                gap: 5px;
                height: 29px;
            }
            paper-icon-button{
                color:var(--icons-color,#515151);
            }
            paper-textarea.box,paper-input.box{
                --paper-input-container_-_padding: 0px 0px;
                --paper-input-container-input_-_padding-left:10px;
            }
            paper-textarea.add-warning-margin,paper-input.add-warning-margin{
                margin-bottom: 15px;
            }
            @media all and (max-width: 550px) {
                .item-grid-container{
                    display: inline-grid;
                    grid-template-columns: 1fr auto;
                    grid-template-rows: auto auto;
                    gap: 0px;
                }
                .item-grid-container > .grid-row-2-item{
                    grid-row:2;
                }
                .item-grid-container > .grid-reposition-btn{
                    grid-column:2;
                }
                paper-textarea.add-warning-margin,paper-input.add-warning-margin{
                    margin-bottom: 20px;
                }
            }
    </style>
    </custom-style>
`;

export const HeaderRowStyle = html`
        <custom-style>    
            <style>
            .header-row{
                display: inline-grid;
                grid-template-columns: 1fr 2fr auto;
                gap: 30px;
                width: calc( 100% - 30px );
                padding: 0px 0px 5px 30px;
                border-bottom: var(--fw-crud-dnd-header-border-size,3px) solid var(--fw-crud-dnd-header-border-color,transparent);
                border-radius: var(--fw-crud-dnd-border-radius,10px);
                font-size: var(--fw-crud-dnd-header-font-size,17px);
                color: var(--fw-crud-dnd-header-text-color,'');
                font-weight: bold;
            }
            .header-row span{
                display: inline-flex;
                align-items: end;                    
            }
            .grid-template-2-column{
                grid-template-columns:1fr minmax(70px,auto);
            }
            .grid-template-1-column{
                grid-template-columns:1fr 2fr;
            }
            @media all and (max-width: 550px) {
                .header-row{
                    display:inline-grid;
                    grid-template-columns:1fr auto;
                    grid-template-rows: auto auto;
                    gap:0px;
                }
                .grid-row-2-item{
                    grid-row:2;
                }
            }
        </style>
    </custom-style>
`;

export const ItemRowStyle = html`
<custom-style>
<style>
    iron-icon{
        color:var(--icons-color,#515151);
        cursor:grabbing;
    }
    .delete-btn:hover{
        color:#d9534f;
    }
    .edit-btn:hover{
        color:#80cbc4;
    }
    .info-btn:hover{
        cursor:pointer;
    }
    .info-btn-text:after {
        content: attr(title);
        font-size: 12px;
        display: block;
        text-align:right;
        width: max-content;
        position: absolute;
        right: 0;
        bottom: auto;
    }
    @media all and (max-width: 550px) {
        .info-btn-text:after{
            font-size:14px;
            max-width:250px;
        }
        paper-icon-button.info-btn-text{
            margin-bottom:20px
        }
    }
</style>
</custom-style>
`;

export const BoxTextAreaStyles = html `
  <custom-style>
    <style>
      paper-textarea.box {
        font-family: var(--theme-font);

        --paper-input-container-input: {
          color: var(--secondary-color);
          font-style: normal;
          font-size: var(--body-font-size, 16px);
          font-family: var(--theme-font);
          border: 1px solid var(--secondary-color-l2);
          border-radius: 2px;
          padding: 5px 10px;
          box-sizing: border-box;
        }

        --paper-input-container-input-focus: {
          border: 1px solid var(--primary-color-l1);
        }

        --paper-input-container-input-invalid: {
          border: 1px solid var(--error-color-l1);
        }

        --paper-input-container-placeholder: {
          /* color: var(--secondary-color-l3); */
          font-style: normal;
          font-size: var(--body-font-size, 16px);
          font-family: var(--theme-font);
        }

        --paper-input-container-underline-focus: {
          display: none !important;
        }

        --paper-input-container-underline: {
          display: none !important;
        }
      }

      paper-textarea.box.no-focus {
        --paper-input-container-input-focus: {
          border: 1px solid var(--secondary-color-l2);
        }
      }
    </style>
  </custom-style>
`;