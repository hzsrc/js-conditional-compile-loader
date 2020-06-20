<temeplate>
    <div>
        /* IFTRUE_myFlag
        <h2>This is a test! For HTML</h2>
        <pre style="font-size:13px;font-family:'Courier New';z-index:9999;line-height: 1.1;">
            {{JSON.stringify($attrs.info || '', null, 4).replace(/"(\\w+)":/g, '$1:')}}
        </pre>
        FITRUE_myFlag */
    </div>
</temeplate>

<script>
    var vueComponent = {
        data: {
            /* IFTRUE_myFlag
            falgData: 'Flag Data',
            FITRUE_myFlag */
        },
    };
</script>

/* IFTRUE_myFlag*/
<style scoped>
    .any-where-test {
        color: red;
    }
</style>
/* FITRUE_myFlag*/


<style id="a" scoped>
    /* IFTRUE_myFlag*/
    .test-for-css {
        color: red;
    }
    /*FITRUE_myFlag */
</style>
