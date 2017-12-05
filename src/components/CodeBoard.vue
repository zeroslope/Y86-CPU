<template>
  <v-card>
    <v-layout>
      <v-tabs v-model="active" centered class="grey darken-2 pl-0">
        <v-tabs-bar dark class="mb-1">
          <v-tabs-item
            v-for="tab in tabs"
            :key="tab"
            :href="'#' + tab"
            ripple
            class="white--text"
          >
            {{tab}}
          </v-tabs-item>
          <v-tabs-slider color="yellow"></v-tabs-slider>
        </v-tabs-bar>

        <v-tabs-items style="height:339px; overflow: scroll; overflow-x: hidden;" class="mt-1">
          <v-tabs-content
            v-for="tab in tabs"
            :key="tab"
            :id="tab"
          >
            <v-card dark flat hover v-for="(line,index) in nowCode" :key='index'>
                <pre class="deep-orange--text text--lighten-2"> {{line}}　</pre>
            </v-card>
          </v-tabs-content>
        </v-tabs-items>
      </v-tabs>
    </v-layout>
  </v-card>
</template>

<script>
var code1 = '                      | /* $begin code-yso */\n                      | /* $begin code-ysa */\n                      | # Execution begins at address 0\n  0x000:              | 	.pos 0\n  0x000: 308400010000 | init:	irmovl Stack, %esp  	# Set up Stack pointer\n  0x006: 308500010000 | 	irmovl Stack, %ebp  	# Set up base pointer\n  0x00c: 7024000000   | 	jmp Main		# Execute main program\n                      |\n                      | # Array of 4 elements\n  0x014:              | 	.align 4\n  0x014: 0d000000     | array:	.long 0xd\n  0x018: c0000000     | 	.long 0xc0\n  0x01c: 000b0000     | 	.long 0xb00\n  0x020: 00a00000     | 	.long 0xa000\n                      |\n  0x024: 308004000000 | Main:	irmovl $4,%eax\n  0x02a: a008         | 	pushl %eax	# Push 4\n  0x02c: 308214000000 | 	irmovl array,%edx\n  0x032: a028         | 	pushl %edx      # Push array\n  0x034: 803a000000   | 	call Sum	# Sum(array, 4)\n  0x039: 10           | 	halt\n                      |\n                      | /* $begin sum-ys 0 */\n                      | 	# int Sum(int *Start, int Count)\n  0x03a: a058         | Sum:	pushl %ebp\n  0x03c: 2045         | 	rrmovl %esp,%ebp\n  0x03e: 501508000000 | 	mrmovl 8(%ebp),%ecx 	# ecx = Start\n  0x044: 50250c000000 | 	mrmovl 12(%ebp),%edx	# edx = Count\n  0x04a: 308000000000 | 	irmovl $0, %eax		# sum = 0\n  0x050: 6222         | 	andl   %edx,%edx\n  0x052: 7374000000   | 	je     End\n  0x057: 506100000000 | Loop:	mrmovl (%ecx),%esi      # get *Start\n  0x05d: 6060         | 	addl %esi,%eax          # add to sum\n  0x05f: 308304000000 | 	irmovl $4,%ebx          #\n  0x065: 6031         | 	addl %ebx,%ecx          # Start++\n  0x067: 3083ffffffff | 	irmovl $-1,%ebx	        #\n  0x06d: 6032         | 	addl %ebx,%edx          # Count--\n  0x06f: 7457000000   | 	jne    Loop             # Stop when 0\n  0x074:              | End:\n  0x074: b058         | 	popl %ebp\n  0x076: 90           | 	ret\n                      | /* $end sum-ys 0 */\n  0x100:              | 	.pos 0x100\n  0x100:              | Stack:	# The stack goes here\n                      | /* $end code-ysa */\n                      | /* $end code-yso */\n';

  export default {
    name: 'CodeBoard',
    props: ['nowCode'],
    data () {
      return {
        tabs: ['asum','List_Sum','Forward'],
        active: null,
        codes: {
          asum: code1,
          List_Sum: code1,
          Forward: code1
        }
      }
    }
  }
</script>

<style scoped>

</style>
